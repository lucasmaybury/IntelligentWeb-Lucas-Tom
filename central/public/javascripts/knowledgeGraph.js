let apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';

/**
 * it inits the widget by selecting the type from the field myType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
function widgetInit() {
    let type= document.getElementById("query_type").value;
    if(type) {
        let config = {
            'limit': 10,
            'languages': ['en'],
            'maxDescChars': 100,
            'types': [type],
            'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("query_input"), config);
    } else {
        alert('Set the type please');
    }
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event) {
    let row = event.row;
    color = '#'+Math.floor(Math.random()*16777215).toString(16);
    document.getElementById('colour-display').style.backgroundColor = color;
    addKGEntry(row, color);
    cacheKG(roomId, color, row);
    document.getElementById("canvas").style.cursor = "crosshair"
    alert("Now draw an annotation!");
}

function setType(){
    console.log('setting type');
    widgetInit();
}

function addKGEntry(row, borderColour) {
    let newAnnotation = document.createElement('div');
    newAnnotation.style.border = 'solid';
    newAnnotation.style.borderColor = borderColour;
    newAnnotation.innerHTML = `
        <h4>Name: ${row.name}</h4>
        <p>ID: ${row.id}</p>
        <p>Description: ${row.detailedDescription || row.description}</p>`;
    document.getElementById('resultPanel').append(newAnnotation);
}