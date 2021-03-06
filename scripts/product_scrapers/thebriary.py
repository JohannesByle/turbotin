from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "thebriary"
    url = "http://www.thebriary.com/tobacco.html"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="product-item"):
            for element in product.find_all():
                if element.get("class"):
                    if " ".join(element.get("class")) == "price":
                        priceraw = element.get_text()
                        head, sep, price = priceraw.partition(":")
                        price = price.strip()
                    if " ".join(element.get("class")) == "status":
                        stock = element.get_text().strip()
                    if " ".join(element.get("class")) == "name":
                        item = element.get_text().strip()
                        link = ("http://www.thebriary.com/" + element.find("a").get("href"))
                if stock == "OUT OF STOCK" or stock == "Out of Stock":
                    stock = "Out of stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        for page in soup.find_all(class_="paging"):
            if page.find("a", string="Next Page"):
                next_url = ("http://www.thebriary.com/" + page.find("a", string="Next Page").get("href"))
                soup = get_html(next_url)
            else:
                next_page = False

    return data
