from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "cigarmerchant"
    urls = ["https://www.cigarmerchant.com/pipes-and-tobaccos/pipe-tobacco/tin-tobacco/",
            "https://www.cigarmerchant.com/pipes-and-tobaccos/pipe-tobacco/tin-tobacco/page2.html",
            "https://www.cigarmerchant.com/pipes-and-tobaccos/pipe-tobacco/tin-tobacco/page3.html"]
    for url in urls:
        soup = get_html(url)
        for product in soup.find_all("div", class_="product-inner"):
            if product.find("a", class_="title"):
                item = product.find("a", class_="title").get_text().strip()
                link = product.find("a", class_="title").get("href")
            if product.find("span", class_="new-price"):
                price = product.find("span", class_="new-price").text
            if product.find("div", class_="red"):
                stock = "Out of stock"
            if product.find("div", class_="green"):
                stock = "In Stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
