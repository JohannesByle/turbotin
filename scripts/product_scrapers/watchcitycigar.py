from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "watchcitycigar"
    url = "https://watchcitycigar.com/packaged-tobacco/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("ul", class_="productGrid"):
            for element in product.find_all("li", class_="product"):
                stock = "Out of stock"
                if element.find("span", class_="price price--withoutTax price--main"):
                    price = element.find("span", class_="price price--withoutTax price--main").get_text().strip()
                if element.find("h4", class_="card-title"):
                    item = element.find("h4", class_="card-title").get_text().strip()
                    link = element.find("a").get("href")
                if element.find("a", class_="button").get_text().strip() == "Add to Cart":
                    stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("li", class_="pagination-item--next"):
            status = soup.find("li", class_="pagination-item--next")
            new_url = status.find("a", class_="pagination-link").get("href")
            soup = get_html(new_url)
        else:
            next_page = False
    return data
