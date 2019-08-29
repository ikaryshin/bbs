from flask import (
    Blueprint,
    request
)

from models.topic import Topic
from models.board import Board
from routes_api import (
    current_user,
    token_required,
    json_succeed,
    topic_returned
)

main = Blueprint('topic', __name__)


@main.route('/<int:id>')
def detail(id):
    m = Topic.get(id)
    return json_succeed(
        topic=topic_returned(m)
    )


@main.route('/add', methods=['POST'])
@token_required
def add():
    form = request.json
    u = current_user()
    t = Topic.new(form, user_id=u.id)
    return json_succeed(
        topic=topic_returned(t),
    )


@main.route('/boards')
def all_boards():
    bs = Board.all()
    return json_succeed(
        boards=[b.json() for b in bs]
    )
