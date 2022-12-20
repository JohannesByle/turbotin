from datetime import datetime
import time
from bs4 import BeautifulSoup
import re
from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "tobaccopipes"
    url = "https://www.tobaccopipes.com/pipe-tobacco"
    cat_soup = get_html(url)
    for link in cat_soup.find_all("a", class_="sub-cat"):
        soup = get_html(link.get("href"))
        while True:
            for li in soup.find_all("li", class_="product"):
                if li.find("h4", class_="card-title"):
                    link = li.find("a").get("href")
                    item = li.find("h4", class_="card-title").text.strip()
                    stock = "In Stock"
                    price = li.find("span", class_="price price--withoutTax").text.strip()

                    if li.find_all("div", class_="outofstock"):
                        stock = "Out of stock"

                    item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
            if soup.find_all("li", class_="pagination-item--next"):
                soup = get_html(soup.find("li", class_="pagination-item--next").find("a").get("href"))
            else:
                break

    return data
