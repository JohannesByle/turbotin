from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "momscigars"
    url = "https://www.momscigars.com/pages/pipe-tobacco-brands"

    soup = get_html(url)
    for cat in soup.find_all("li", class_="collection-item"):
        if cat.find("h4").get_text():
            link = ("https://momscigars.com" + cat.find("a").get("href"))
            error = True
            wait_time = 2.75
            while error:
                try:
                    new_soup = get_html(link)
                    error = False
                except:
                    time.sleep(wait_time)
                    print("An Error Occurred: sleeping " + str(wait_time) + "s")
                    wait_time = wait_time + 1
                for element in new_soup.find_all("div", class_="product-grid-item"):
                    if element.find("h4"):
                        stock = "In Stock"
                        item = element.find("h4").get_text().strip()
                    if element.find("a"):
                        link = ("https://momscigars.com" + element.find("a").get("href"))
                    if element.find("span", class_="prices-container"):
                        price = element.find("span", class_="prices-container").get_text().strip()
                    if element.find("span", class_="badge badge--sold-out"):
                        stock = "Out of stock"
                    item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)


    return data
