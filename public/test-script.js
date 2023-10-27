/* eslint-disable no-undef */
const selectAsset = () => {
    return new Promise(resolve => resolve([
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg',
            mimeType: 'image/jpeg',
            fileName: 'My Image'
        },
        {
            src: 'https://cloud.squidex.io/api/assets/squidex-website/18b271cf-67c8-4bac-82a9-d85d662168f7/administration-tools-in-squidex.jpg?version=0',
            mimeType: 'image/jpeg',
            fileName: 'My Image'
        }
    ]));
};

const selectContents = () => {
    return new Promise(resolve => resolve([
        {
            id: '123',
            schemaName: 'my-short-schema',
            title: 'Squidex'
        },
        {
            id: '456',
            schemaName: 'my-very-long-schema-name-that-does-not-fit',
            title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua'
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

const baseOptions = {
    appName: 'squidex-website',
    baseUrl: 'https://cloud.squidex.io',
    canSelectAIText: true,
    canSelectContents: true,
    canSelectAssets: true,
    onSelectAIText: selectAIText,
    onSelectAssets: selectAsset,
    onSelectContents: selectContents,
    classNames: ['text-left', 'price-alarm']
};

const editor1Wrapper = new SquidexEditorWrapper(document.getElementById('editor1'), {
    ...baseOptions,
    mode: 'Markdown',
    onChange: value => {
        updateValue1(value);
    },
    value: 'Hello\n\n---\n\nWorld'
});

document.getElementById('unset1').addEventListener('click', () => {
    updateValue1(undefined);
});

const editor2Wrapper = new SquidexEditorWrapper(document.getElementById('editor2'), {
    ...baseOptions,
    mode: 'Html',
    onChange: value => {
        updateValue2(value);
    }
});

document.getElementById('unset2').addEventListener('click', () => {
    updateValue2(undefined);
});