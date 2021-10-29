from . import get_html, add_item
import json


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "thestorytellers"
    st_url = ["https://www.thestorytellerspipe.com/tinned-tobacco-a-c",
              "https://www.thestorytellerspipe.com/tinned-tobacco-m-o",
              "https://www.thestorytellerspipe.com/tinned-tobacco-p-r"]
    for url in st_url:
        soup = get_html(url)

        for category in soup.find_all("a", class_="_1fbEI"):
            new_soup = get_html(category.get("href"))
            for product in new_soup.find_all("div", class_="_3DNsL"):
                if product.find("div", class_="_1bfj5"):
                    if product.find("h3"):
                        item = product.find("h3").get_text()
                    if product.find("span", class_="_2-l9W"):
                        price = product.find("span", class_="_2-l9W").get_text()
                if product.find("a", class_="_3mKI1"):
                    link = product.find("a", class_="_3mKI1").get("href")
                if product.find("div", class_="_30f72"):
                    if (product.find("div", class_="_30f72").get_text() == "Add to Cart"):
                        stock = "In Stock"
                    else:
                        stock = "Out of stock"

                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
    return data
