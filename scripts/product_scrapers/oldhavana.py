from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "oldhavana"
    url = "https://www.oldhavanacigar.com/store/pipe-tobacco/all-pipe-tobacco.html"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("table"):
            if product.get("width") == "600px":
                for element in product.find_all("td"):
                    if element.get("width") == "265px":
                        item = element.find("span").get_text().strip()
                        link = element.find("a").get("href")
                    if element.find("img", class_="pricing redstar"):
                        pricelist = element.find_all("span")[1]
                        price = pricelist.get_text().strip()
                    if element.find("button", class_="button"):
                        if element.find("span").get_text().strip() == "Add to Cart":
                            stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("img", class_="sprite pager_arrow_right"):
            for cats in soup.find_all("td", class_="pages")[:-1]:
                cat2 = cats.find_all("li")
                for cat in cat2:
                    if cat.find("img", class_="sprite pager_arrow_right"):
                        soup = get_html(cat.find("a").get("href"))
        else:
            next_page = False

    return data
