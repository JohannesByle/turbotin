from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "grove"
    url = "https://www.grovepipeandtobacco.com/tobacco"

    soup = get_html(url)
    for element in soup.find_all("div", class_="grid-item"):
        stock = ""
        if element.find("a", class_="grid-item-link"):
            link = ("https://www.grovepipeandtobacco.com" + element.find("a", class_="grid-item-link").get("href"))
        if element.find("div", class_="grid-title"):
            item = element.find("div", class_="grid-title").get_text().strip()
        if element.find("div", class_="product-price"):
            price = element.find("div", class_="product-price").get_text().strip()
        if element.find("div", class_="product-mark sold-out"):
            stock = "Out of stock"
        if stock != "Out of stock":
            stock = "In Stock"
        item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
