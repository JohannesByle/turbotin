from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "tinderbox"
    url = "https://www.tinderbox.com/collections/tin-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="product"):
            if product.find("div", class_="product__title"):
                item = product.find("div", class_="product__title").get_text().strip()
                link = ("https://tinderbox.com" + product.find("a").get("href"))
            if product.find("div", class_="product__prices"):
                if product.find("span", class_="product__price"):
                    price = product.find("span", class_="product__price").get_text().strip()
                if product.find("span", class_="product__price--on-sale"):
                    price = product.find("span", class_="product__price--on-sale").get_text().strip()
                price = price.split("$")
                price = "$" + price[-1]
            if product.find("strong", class_="sold-out-text"):
                stock = "Out of stock"
            else:
                stock = "In Stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("span", class_="next"):
            status = soup.find("span", class_="next")
            new_url = ("https://tinderbox.com" + status.find("a").get("href"))
            soup = get_html(new_url)
        else:
            next_page = False
    return data
