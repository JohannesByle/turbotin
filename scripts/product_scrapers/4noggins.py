from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "4noggins"
    url = "https://4noggins.com/collections/tinned-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="product-thumbnail"):
            for element in product.find_all():
                if element.get("class"):
                    if " ".join(element.get("class")) == "money":
                        price = element.get_text()
                        stock = "In Stock"
                    if " ".join(element.get("class")) == "product-thumbnail__title":
                        itemraw = element.get_text().strip()
                        item = itemraw.translate({ord(":"): None})
                        link = ("https://4noggins.com" + element.get("href"))
                    if " ".join(element.get("class")) == "product-thumbnail__sold-out sold-out":
                        stockcheck = element.get_text()
                        if stockcheck == "Sold Out":
                            stock = "Out of stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="button button--primary pagination-button__load-more"):
            soup = get_html("https://4noggins.com" + soup.find("a",
                                                               class_="button button--primary pagination-button__load-more").get(
                "href"))
        else:
            next_page = False

    return data
