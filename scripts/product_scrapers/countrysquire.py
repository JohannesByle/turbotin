from . import get_html, add_item
from bs4 import BeautifulSoup
import json


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "countrysquire"
    url = "https://www.thecountrysquireonline.com/product-category/tobacco/name-brand-favorites/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("li", class_="ast-col-sm-12"):
            item = product.find("h2").text
            if product.find("ins"):
                price = product.find("ins").text
            else:
                if product.find("bdi"):
                    price = product.find("bdi").text
            if product.find("a", class_="button").text == "Read more":
                stock = "Out of stock"
            if product.find("a", class_="button").text == "Add to cart":
                stock = "In Stock"
            link = product.find("a").get("href")
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        if soup.find("a", class_="next page-numbers"):
            new_url = soup.find("a", class_="next page-numbers").get("href")
            soup = get_html(new_url)
        else:
            next_page = False


    return data
