from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "tophat"
    url = "https://tophattobacco.com/pipe-tobacco/"

    soup = get_html(url)

    for bar in soup.find_all("li", class_="subcategory-item"):
        error = True
        wait_time = 2.75
        while error:
            try:
                pagelink = bar.find("a", class_="subcategory-link").get("href")
                new_soup = get_html(pagelink)
                error = False
            except:
                time.sleep(wait_time)
                print("An Error Occurred: sleeping " + str(wait_time) + "s")
                wait_time = wait_time + 1
                pass
        if new_soup.find("span", class_="productView-reviewLink"):
            for product in new_soup.find_all("div", class_="productView thumbnail-unclicked qty-box-visible"):
                if product.find("h1", class_="productView-title"):
                    item = product.find("h1", class_="productView-title").get_text().strip()
                    link = product.find("a").get("href")
                if product.find("div", class_="productView-price"):
                    if product.find("span", class_="price price--withoutTax"):
                        price = product.find("span", class_="price price--withoutTax").get_text()
                if product.find("div", class_="alertBox alertBox--error"):
                    stock = "Out of stock"
                else:
                    stock = "In Stock"

                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

        else:
            for product in new_soup.find_all("div", class_="card-body"):
                if product.find("h4", class_="card-title"):
                    item = product.find("h4", class_="card-title").get_text().strip()
                    link = product.find("a").get("href")
                if product.find("span", class_="price price--withoutTax"):
                    price = product.find("span", class_="price price--withoutTax").get_text()
                if product.find("a", class_="button"):
                    if product.find("a", class_="button").get("href") == "#":
                        stock = "Out of stock"
                    else:
                        stock = "In Stock"

                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
    return data
