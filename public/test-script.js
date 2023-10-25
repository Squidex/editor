/* eslint-disable no-undef */
const selectAsset = () => {
    return new Promise(resolve => resolve([
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg',
            type: 'image/jpeg',
            fileName: 'My Image'
        },
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg',
            type: 'image/jpeg',
            fileName: 'My Image'
        }
    ]));
};

const selectContents = () => {
    return new Promise(resolve => resolve([
        {
            href: 'https://squidex.io',
            title: 'Squidex'
        },
        {
            href: 'https://squidex.io',
            title: 'Squidex'
        }
    ]));
};

const selectAIText = () => {
    return new Promise(resolve => resolve('Text from AI'));
};

const editor1Preview = document.getElementById('textarea1');
const editor2Preview = document.getElementById('textarea2');

let value1 = '';
let value2 = '';

function updateValue1(value) {
    if (value1 !== value) {
        value1 = value;
        
        editor1Wrapper.setValue(value);
        editor1Preview.value = `${value}`;

        console.log(`Value1 changed to ${value1}`);
    }
}

function updateValue2(value) {
    if (value2 !== value) {
        value2 = value;
        
        editor2Wrapper.setValue(value);
        editor2Preview.value = `${value}`;

        console.log(`Value2 changed to ${value1}`);
    }
}

const editor1Wrapper = new SquidexEditorWrapper(document.getElementById('editor1'), {
    mode: 'Markdown',
    canSelectAIText: true,
    canSelectContents: true,
    canSelectAssets: true,
    onSelectAIText: selectAIText,
    onSelectAssets: selectAsset,
    onSelectContents: selectContents,
    onChange: value => {
        updateValue1(value);
    },
    value: 'Line1\n\n---\n\nLine2'
});

document.getElementById('unset1').addEventListener('click', () => {
    updateValue1(undefined);
});

const editor2Wrapper = new SquidexEditorWrapper(document.getElementById('editor2'), {
    mode: 'Html',
    canSelectAIText: true,
    canSelectContents: true,
    canSelectAssets: true,
    onSelectAIText: selectAIText,
    onSelectAssets: selectAsset,
    onSelectContents: selectContents,
    onChange: value => {
        updateValue2(value);
    }
});

document.getElementById('unset2').addEventListener('click', () => {
    updateValue2(undefined);
});