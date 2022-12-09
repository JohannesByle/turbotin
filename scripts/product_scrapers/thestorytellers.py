from . import get_html, add_item
import json


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "thestorytellers"
    url = "https://www.thestorytellerspipe.com/tinned-tobacco"
    soup = get_html(url)
    page = 1
    button = True
    wait_time = 2.75
    while button:
        try:
            if soup.find("button", class_="txtqbB"):
                page = page + 1
                url = ("https://www.thestorytellerspipe.com/tinned-tobacco?page=" + str(page))
                soup = get_html(url)
            else:
                button = False
        except:
            time.sleep(wait_time)
            wait_time = wait_time + 1
            pass
    else:
        for category in soup.find_all("ul", class_="S4WbK_ c2Zj9x"):
            for product in category.find_all("li"):
                if product.find("h3"):
                    item = product.find("h3").get_text()
                if product.find("span", class_="cfpn1d"):
                    price = product.find("span", class_="cfpn1d").get_text()
                if product.find("a", class_="JPDEZd"):
                    link = product.find("a", class_="JPDEZd").get("href")
                if product.find("span", class_="so1sCxo"):
                    if (product.find("span", class_="so1sCxo").get_text() == "Add to Cart"):
                        stock = "In Stock"
                    else:
                        stock = "Out of stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
    return data
