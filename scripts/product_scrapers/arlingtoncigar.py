from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "arlingtoncigar"
    url = "https://arlingtoncigar.com/collections/pipe-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("li", class_="grid__item"):
            if element.find("a", class_="grid-view-item__link"):
                item = element.find("a", class_="grid-view-item__link").get_text().strip()
                link = ("https://arlingtoncigar.com" + element.find("a", class_="grid-view-item__link").get("href"))
            if element.find("div", class_="price-wrapper"):
                price = element.find("div", class_="price-wrapper").get_text().strip()
            if element.find("span", class_="price-item price-item--sale"):
                price = element.find("span", class_="price-item price-item--sale").get_text().strip()
            if element.find("div", class_="grid-view-item grid-view-item--sold-out product-card"):
                stock = "Out of stock"
            else:
                stock = "In Stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        for pages in soup.find_all("ul", class_="list--inline pagination"):
            for page in pages.find_all("li"):
                if page.get_text().strip() == "Next page":
                    if page.find("button"):
                        next_page = False
                    else:
                        new_url = ("https://arlingtoncigar.com" + page.find("a").get("href"))
                        soup = get_html(new_url)
    return data
