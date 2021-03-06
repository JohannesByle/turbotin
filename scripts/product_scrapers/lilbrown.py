from . import get_html, add_item
import re


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "lilbrown"
    url = "https://www.lilbrown.com/c-202-pipe-tobacco.aspx"

    soup = get_html(url)
    for category in soup.find("div", class_="tabbitTabWrap").find_all("td", class_="subEntityCell"):
        new_soup = get_html("https://www.lilbrown.com/" + category.find("a").get("href"))
        for product in new_soup.find_all("div", class_="productGridCellContents"):
            price = product.find("div", class_="price-wrap").get_text()
            price = re.findall(r"\$\d{1,3}\.\d{2}", price)[-1]
            item = product.find(class_="productGridNameWrap").find("a").get_text()
            link = "https://www.lilbrown.com/" + product.find("a").get("href")
            if "Buy Now" in product.find(class_="stock-hint").get_text():
                stock = "In stock"
            else:
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data
