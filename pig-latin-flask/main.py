from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

def to_pig_latin(phrase):
    words = phrase.split()
    pig_latin_words = []
    
    for word in words:
        if word[0].lower() in 'aeiou':
            pig_latin_words.append(word + 'way')
        else:
            consonant_cluster = ''
            for char in word:
                if char.lower() not in 'aeiou':
                    consonant_cluster += char
                else:
                    break
            pig_latin_words.append(word[len(consonant_cluster):] + consonant_cluster + 'ay')
    
    return ' '.join(pig_latin_words)

@app.route('/pig-latin', methods=['POST'])
def generate_pig_latin():
    data = request.json
    if 'phrase' not in data:
        return jsonify({'error': 'No phrase provided'}), 400
    
    english_phrase = data['phrase']
    pig_latin_phrase = to_pig_latin(english_phrase)
    
    return jsonify({'pig_latin': pig_latin_phrase})

@app.route('/', methods=['GET', 'POST'])
def web_interface():
    result = ''
    if request.method == 'POST':
        phrase = request.form.get('phrase', '')
        result = to_pig_latin(phrase)
    
    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pig Latin Translator</title>
    </head>
    <body>
        <h1>Pig Latin Translator</h1>
        <form method="POST">
            <input type="text" name="phrase" placeholder="Enter English phrase">
            <input type="submit" value="Translate">
        </form>
        {% if result %}
        <h2>Result:</h2>
        <p>{{ result }}</p>
        {% endif %}
    </body>
    </html>
    '''
    return render_template_string(html, result=result)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000,debug=True)
