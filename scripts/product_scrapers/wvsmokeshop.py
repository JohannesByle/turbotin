from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "wvsmokeshop"
    url = "https://wvsmokeshop.com/pipetobacco.aspx"

    soup = get_html(url)
    for cat in soup.find_all("div", class_="category-list-item-head"):
        error = True
        wait_time = 2.75
        for links in cat.find_all("a"):
            new_url = ("https://wvsmokeshop.com" + links.get("href"))
            while error:
                try:
                    new_soup = get_html(new_url)
                    error = False
                except:
                    time.sleep(wait_time)
                    print("An Error Occurred: sleeping " + str(wait_time) + "s")
                    wait_time = wait_time + 1
                    pass
            for element in new_soup.find_all("div", class_="product-list-options"):
                stock = ""
                if element.find("h5"):
                    item = element.find("a").get_text().strip()
                    link = ("https://wvsmokeshop.com" + element.find("a").get("href"))
                if element.find("span", class_="product-list-cost-value"):
                    price = element.find("span", class_="product-list-cost-value").get_text().strip()
                if element.find("span", class_="zOeYx3"):
                    stock = element.find("span", class_="zOeYx3").get_text().strip()
                if stock != "Out of stock":
                    stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
