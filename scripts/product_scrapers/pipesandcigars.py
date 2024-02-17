from . import get_html, add_item
import json
import re
from slugify import slugify


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "pipesandcigars"
    url = "https://www.pipesandcigars.com/category/pipe-tobacco/tinned-tobaccos/?&sz=100"

    soup = get_html(url)
    next_page = True
    page = 1
    while next_page:
        for element in soup.find_all("div", class_="col product-grid-tile product-spacing"):
            if element.find("a"):
                link = "https://www.pipesandcigars.com/" + element.find("a").get("href")
            if element.find("p", class_="product-tile-product-name"):
                item = element.find("p", class_="product-tile-product-name").get_text()
            stock = "In Stock"
            if element.find("span", class_="value"):
                price = "$" + element.find("span", class_="value").get("content")

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="right-arrow"):
            page = page + 1
            new_url = "https://www.pipesandcigars.com/category/pipe-tobacco/tinned-tobaccos/?&start=" + str(
                page) + "00&sz=100"
            soup = get_html(new_url)
        else:
            next_page = False

    return data
