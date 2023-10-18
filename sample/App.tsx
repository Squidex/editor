import * as React from 'react';
import { Asset, Content, Editor } from './../lib/Editor'
import './App.css'

function App() {
  const [valueHtml, setValueHtml] = React.useState('');
  const [valueMarkdown, setValueMarkdown] = React.useState('');

  const selectAsset = () => {
    return new Promise<Asset[]>(resolve => resolve([
      { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg' 
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg'
      }
    ]));
  }

  const selectContents = () => {
    return new Promise<Content[]>(resolve => resolve([
      { 
        href: 'https://squidex.io', title: 'Squidex'
      },
      {
        href: 'https://squidex.io', title: 'Squidex'
      }
    ]));
  }

  return (
    <>
      <Editor onSelectAssets={selectAsset} onSelectContents={selectContents} mode='Markdown' value={valueMarkdown} onChange={setValueMarkdown} />

      <textarea readOnly value={valueMarkdown} />

      <Editor onSelectAssets={selectAsset} onSelectContents={selectContents} mode='Html' value={valueHtml} onChange={setValueHtml} />
      
      <textarea readOnly value={valueHtml} />
    </>
  )
}

export default App
