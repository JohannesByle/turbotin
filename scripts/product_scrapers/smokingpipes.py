from . import get_html, add_item
import re
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "smokingpipes"
    url = "https://www.smokingpipes.com/tobacco/tinned/"

    soup = get_html(url)
    for cat in soup.find_all(class_="catBox"):
        error = True
        wait_time = 2.75
        while error:
            try:
                new_soup = get_html("https://www.smokingpipes.com" + cat.find("a").get("href"))
                error = False
            except:
                time.sleep(wait_time)
                wait_time = wait_time + 1
                pass
        for product in new_soup.find_all(class_="product"):
            for element in product.find_all():
                if element.get("class"):
                    if " ".join(element.get("class")) == "noStock":
                        if element.get_text() == "Currently Out of Stock":
                            stock = "Out of stock"
                        else:
                            stock = element.get_text().strip()
                    if " ".join(element.get("class")) == "price" and \
                            element.get_text().strip() != "Currently Out of Stock":
                        price = min(re.findall(r"\$\d+\.\d+", element.get_text().strip()))
                        stock = "In Stock"
                    if " ".join(element.get("class")) == "imgDiv":
                        for items in element.find_all("a"):
                            link = "https://www.smokingpipes.com" + items.get("href")
                if element.get("src") and not element.get("class"):
                    item = element.get("alt")
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
