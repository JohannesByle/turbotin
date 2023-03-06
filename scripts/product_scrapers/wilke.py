from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "wilke"
    url = "https://www.wilkepipetobacco.com/tincellar"

    soup = get_html(url)
    for cats in soup.find_all("div", class_="KcpHeO"):
        # print(cats)
        error = True
        wait_time = 2.75
        for cat in cats.find_all("h2", class_="font_2"):
            for links in cat.find_all("a"):
                new_url = links.get("href")
                while error:
                    try:
                        new_soup = get_html(new_url)
                        error = False
                    except:
                        time.sleep(wait_time)
                        print("An Error Occurred: sleeping " + str(wait_time) + "s")
                        wait_time = wait_time + 1
                        pass
                for product in new_soup.find_all("ul", class_="S4WbK_ uQ5Uah c2Zj9x"):
                    for element in product.find_all("div", class_="ETPbIy WJH1qD"):
                        stock = ""
                        if element.find("div", class_="CZ0KIs"):
                            if element.find("h3"):
                                item = element.find("h3").get_text().strip()
                            if element.find("a", class_="JPDEZd"):
                                link = element.find("a", class_="JPDEZd").get("href")
                        if element.find("span", class_="cfpn1d"):
                            price = element.find("span", class_="cfpn1d").get_text().strip()
                        if element.find("span", class_="zOeYx3"):
                            stock = element.find("span", class_="zOeYx3").get_text().strip()
                        if stock != "Out of stock":
                            stock = "In Stock"

                        item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
