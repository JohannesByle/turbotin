import urllib.request as request
from bs4 import BeautifulSoup
from datetime import datetime


def get_html(url):
    req = request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46 | Turbotin ',
        'Referer': 'https://www.turbotin.com'})
    response = request.urlopen(req)
    return BeautifulSoup(response.read(), features="lxml")


def add_item(data, name, item, price, stock, link, pbar):
    data.append({"store": name, "item": item, "price": price, "stock": stock, "link": link,
                 "time": datetime.now().strftime("%m/%d/%Y %H:%M")})
    if pbar is not None:
        pbar.set_description(", ".join([name, item]))
    return ["", "", "", ""]
