from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "briarworks"
    url = "https://briarworksusa.com/pipe-tobacco/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("article", class_="product-item"):
            if product.find("h3", class_="product-item-title"):
                item = product.find("h3", class_="product-item-title").get_text().strip()
                link = product.find("a").get("href")
            if product.find("div", class_="price"):
                price = product.find("div", class_="price").get_text().strip()
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
