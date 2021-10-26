from . import get_html, add_item
import json
import re
from slugify import slugify


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "pipesandcigars"
    url = "https://www.pipesandcigars.com/shop/packaged-tobacco/1800125/?v=5000"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("script"):
            if element.get_text().startswith("var WTF"):
                json_data = json.loads(re.match("var WTF=({.+});", element.get_text()).group(1))
                for product in json_data["page"]["products"]:
                    item = product["fullName"] + " " + product["pack"]
                    price = r"$" + str(product["price"])
                    stock = product["availability"]
                    if stock == "Out of Stock":
                        stock = "Out of stock"
                    link = "https://www.pipesandcigars.com/p/" + slugify(product["fullName"]) + "/" + \
                           str(product["id"])
                    item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        if soup.find("ul", class_="ui-pagination"):
            status = soup.find("li", class_="ui-pagination-nav-next")
            if status.find("span", class_="link-disabled"):
                next_page = False
            else:
                new_url = "https://www.pipesandcigars.com/" + status.find("a").get("href")
                soup = get_html(new_url)

    return data
