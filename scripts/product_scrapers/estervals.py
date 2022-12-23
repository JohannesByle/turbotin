from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "estervals"
    url = "https://www.tecon-gmbh.de/index.php?cPath=667"

    soup = get_html(url)
    for cats in soup.find_all("td", class_="mws_boxCenter"):
        for cat in cats.find_all("td", class_="main"):
            error = True
            wait_time = 2.75
            for links in cat.find_all("a"):
                new_url = (links.get("href") + "&language=en&lgcode=1")
                while error:
                    try:
                        new_soup = get_html(new_url)
                        error = False
                    except:
                        time.sleep(wait_time)
                        print("An Error Occurred: sleeping " + str(wait_time) + "s")
                        wait_time = wait_time + 1
                        pass
                for product in new_soup.find_all("table", class_="productListing"):
                    elements = product.find_all("tr")[1:]
                    for element in elements:
                        if element.find("a", class_="list_name"):
                            item = element.find("a", class_="list_name").get_text().strip()
                            link = element.find("a", class_="list_name").get("href")
                        if element.find("span", class_="pl_list_price_wrapper"):
                            pricebulk = element.find("span", class_="pl_list_price_wrapper").get_text().strip().split(
                                "€")
                            price = ("€" + pricebulk[0])
                        for pics in element.find_all("img"):
                            if pics.get("title") == "Available":
                                stock = "In Stock"
                            if pics.get("title") == "Sold Out":
                                stock = "Out of stock"

                        item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
