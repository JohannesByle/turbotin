from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "briarworks"
    url = "https://briarworksusa.com/collections/pipe-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="grid-product__content"):
            if product.find("div", class_="grid-product__title grid-product__title--body"):
                item = product.find("div", class_="grid-product__title grid-product__title--body").get_text().strip()
            if product.find("a"):
                link = ("https://briarworksusa.com" + product.find("a").get("href"))
            if product.find("div", class_="grid-product__price"):
                price = product.find("div", class_="grid-product__price").get_text().strip()
            if product.find("strong", class_="sold-out-text"):
                stock = "Out of stock"
            else:
                stock = "In Stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        if soup.find("a", class_="pagination-item pagination-next"):
            new_url = soup.find("a", class_="pagination-item pagination-next").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data
