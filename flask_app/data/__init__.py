from flask_smorest import Blueprint
from sqlalchemy import Date
from sqlalchemy.sql import func
import marshmallow as ma

from ..models import Tobacco, TobaccoPrice, db

bp = Blueprint('data', __name__, url_prefix='/data')


class ObsTobacco(ma.Schema):
    id = ma.fields.Integer()
    store = ma.fields.String()
    item = ma.fields.String()
    link = ma.fields.String()
    price = ma.fields.String()
    time = ma.fields.DateTime()
    stock = ma.fields.String()


@bp.route('/current_tobaccos', methods=['POST'])
@bp.response(200, ObsTobacco(many=True))
def current_tobaccos():
    max_time = db.session.\
        query(func.cast(func.max(TobaccoPrice.time), Date)).\
        subquery().as_scalar()

    sub_sub_query = db.session.\
        query(TobaccoPrice.tobacco_id, func.max(TobaccoPrice.time).label('max_time')).\
        group_by(TobaccoPrice.tobacco_id).subquery()

    sub_query = db.session.\
        query(TobaccoPrice).\
        join(sub_sub_query, sub_sub_query.c.tobacco_id == TobaccoPrice.tobacco_id).\
        filter(TobaccoPrice.time == sub_sub_query.c.max_time).subquery()

    query = db.session.\
        query(Tobacco, sub_query).\
        join(sub_query).\
        filter(func.cast(sub_query.c.time, Date) == max_time)

    result = []
    for (t, _, _, price, time, stock) in query.all():
        obs_tobacco = ObsTobacco()
        obs_tobacco.store = t.store
        obs_tobacco.link = t.link
        obs_tobacco.item = t.item
        obs_tobacco.id = t.id
        obs_tobacco.price = price
        obs_tobacco.time = time
        obs_tobacco.stock = stock
        result.append(obs_tobacco)
    return result
