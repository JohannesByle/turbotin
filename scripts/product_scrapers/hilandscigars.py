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
        for product in soup.find_all("div", class_="product-small box"):
            stock = "Out of stock"
            if product.find("p", class_="name product-title woocommerce-loop-product__title"):
                item = product.find("p", class_="name product-title woocommerce-loop-product__title").get_text().strip()
            if product.find("a", class_="woocommerce-LoopProduct-link woocommerce-loop-product__link"):
                link = product.find("a", class_="woocommerce-LoopProduct-link woocommerce-loop-product__link").get(
                    "href")
            if product.find("span", class_="price"):
                stock = "In Stock"
                if product.find("ins"):
                    price = product.find("ins").get_text()
                else:
                    if product.find("bdi"):
                        price = product.find("bdi").get_text()

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="next page-number"):
            new_url = soup.find("a", class_="next page-number").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data
