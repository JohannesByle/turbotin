from . import get_html, add_item
import re
import json


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "hilandscigars"
    url = "https://hilandscigars.com/product-tag/pipe-tobacco/page/0/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for products in soup.find_all("ul", class_="products"):
            for product in products.find_all("li", class_="product"):
                item = product.find("h2").text
                if product.find("ins"):
                    price = product.find("ins").text
                else:
                    if product.find("bdi"):
                        price = product.find("bdi").text
                if product.find("span", class_="price"):
                    stock = "In Stock"
                else:
                    stock = "Out of stock"
                link = product.find("a").get("href")
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        if soup.find("a", class_="next page-numbers"):
            new_url = soup.find("a", class_="next page-numbers").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data
