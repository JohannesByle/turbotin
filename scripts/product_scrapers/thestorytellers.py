from . import get_html, add_item
import json


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "thestorytellers"
    url = "https://www.thestorytellerspipe.com/tinned-tobacco"
    soup = get_html(url)
    page = 1
    wait_time = 2.75
    next_page = True
    while next_page:
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


        for buttons in soup.find_all("button", class_="txtqbB"):
            if buttons.get_text() == "Load Previous":
                next_page = False

            if buttons.get_text() == "Load More":
                next_page = True
                page = page + 1
                url = ("https://www.thestorytellerspipe.com/tinned-tobacco?page=" + str(page))
                soup = get_html(url)


    return data
