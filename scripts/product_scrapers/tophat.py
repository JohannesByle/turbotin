from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "tophat"
    url = "https://tophattobacco.com/pipes-and-pipe-tobacco/pipe-tobacco/"

    soup = get_html(url)

    for bar in soup.find_all("li", class_="subcategory-item"):
        error = True
        wait_time = 2.75
        while error:
            try:
                new_soup = get_html(bar.find("a", class_="subcategory-link").get("href"))

                error = False
            except:
                time.sleep(wait_time)
                print("An Error Occurred: sleeping " + str(wait_time) + "s")
                wait_time = wait_time + 1
                pass
        for product in new_soup.find_all("div", class_="card-body"):
            if product.find("h4", class_="card-title"):
                item = product.find("h4", class_="card-title").get_text().strip()
            if product.find("a", class_="image-link desktop"):
                link = product.find("a", class_="image-link desktop").get("href")
            if product.find("span", class_="price price--withoutTax"):
                price = product.find("span", class_="price price--withoutTax").get_text()
            if product.find("a", class_="button button--small card-figcaption-button"):
                stock = "In Stock"
            else:
                stock = "Out of stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
    return data
