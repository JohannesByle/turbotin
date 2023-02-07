from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "pipenook"
    url = "https://thepipenook.com/tobacco/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="card-body"):
            if element.find("h3", class_="card-title"):
                item = element.find("h3", class_="card-title").get_text().strip()
                link = element.find("a").get("href")
            if element.find("span", class_="price price--withoutTax"):
                price = element.find("span", class_="price price--withoutTax").get_text().strip()
            stock = "In Stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("li", class_="pagination-item--next"):
            links = soup.find("li", class_="pagination-item--next")
            link = links.find("a")
            soup = get_html(link.get("href"))
        else:
            next_page = False
    return data
