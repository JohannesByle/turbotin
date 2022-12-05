from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "thebriary"
    url = "https://thebriary.com/tobacco/tin-tobacco/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("li", class_="product"):
            stock = "Out of stock"
            if product.find("h3", class_="card-title"):
                item = product.find("h3", class_="card-title").get_text().strip()
                link = product.find("a").get("href")
            if product.find("span", class_="price--withoutTax"):
                price = product.find("span", class_="price--withoutTax").get_text().strip()
            if product.find("a", class_="button"):
                if product.find("a", class_="button").get_text().strip() == "Add to Cart":
                    stock = "In Stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("li", class_="pagination-item--next"):
            status = soup.find("li", class_="pagination-item--next")
            new_url = status.find("a", class_="pagination-link").get("href")
            soup = get_html(new_url)
        else:
            next_page = False


    return data
