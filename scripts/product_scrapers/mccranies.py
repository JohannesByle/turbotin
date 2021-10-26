from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "mccranies"
    url = "https://mccranies.com/product-category/tin-tobaccos/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("li", class_="product"):
            item = product.find("h3").get_text().strip()
            if product.find("ins"):
                price = product.find("ins").text
            else:
                if product.find("bdi"):
                    price = product.find("bdi").text
            if product.find("div", class_="fusion-out-of-stock"):
                stock = "Out of stock"
            else:
                stock = "In Stock"
            link = product.find("a").get("href")

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        if soup.find("a", class_="next page-numbers"):
            new_url = soup.find("a", class_="next page-numbers").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data
