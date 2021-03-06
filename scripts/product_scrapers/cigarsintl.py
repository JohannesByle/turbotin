from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "cigarsintl"
    url = "https://www.cigarsinternational.com/shop/pipe-tobacco/1800049/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="offer-prod"):
            for element in product.find_all():
                if element.get("class"):
                    if " ".join(element.get("class")) == "price-amount":
                        price = "$" + element.get("data-value")
                    if " ".join(element.get("class")) == "title-inner":
                        item = element.get_text().strip()
                    if " ".join(element.get("class")) == "offer-title":
                        link = ("https://www.cigarsinternational.com" + element.get("href"))
                    if " ".join(element.get("class")) == "offer-stock":
                        stock = element.get_text().strip()
                        if stock == "Out Of Stock":
                            stock = "Out of stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("ul", class_="ui-pagination"):
            status = soup.find("li", class_="ui-pagination-nav-next")
            if status.find("span", class_="link-disabled"):
                next_page = False
            else:
                new_url = "https://www.cigarsinternational.com" + status.find("a").get("href")
                soup = get_html(new_url)

    return data
