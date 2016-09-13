#!/usr/bin/env python

from flask import Flask, abort, current_app, render_template, request
from jinja2.exceptions import TemplateNotFound
from mandrill import Mandrill


app = Flask(__name__)
app.config['SECRET_KEY'] = 'default secret key'
app.config.from_envvar('WWW_MEDSITE_CONFIG', silent=True)


@app.route('/')
@app.route('/<page>/')
def page(page='index'):
    try:
        return render_template('{}.html'.format(page), page=page)
    except TemplateNotFound:
        abort(404)


@app.route('/clients/')
@app.route('/clients/<int:department>/')
def clients(department=None):
    return render_template('clients.html', page='news', department=department)


@app.route('/contact/', methods=['POST'])
def contact():
    message = {
        'to': [{'email': 'contact@medsite.fr'}],
        'from_email': 'contact@medsite.fr',
        'subject': 'Message de www.medsite.fr',
        'html': 'Contact : {}\nMessage : {}'.format(
            request.form['mail'], request.form['comment'])}
    if not current_app.debug:
        mandrill_client = Mandrill(app.config.get('MANDRILL_KEY'))
        mandrill_client.messages.send(message=message)
    return 'ok'


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    from sassutils.wsgi import SassMiddleware
    app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'medsite': ('static', 'static', '/static')})
    app.run(debug=True, host='0.0.0.0')
