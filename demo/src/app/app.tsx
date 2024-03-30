import { Code } from '@/lib';

const codeBlock = `
import { React } from 'react';
import * as moment from 'moment';

// this is a comment
export default function() {
  return (
    <Tab>
      <Tab.Content>HTML</Tab.Content>
    </Tab>
  )
}
`;

const htmlBlock = `
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
`;

export function App() {
  return (
    <div className="p-4">
      <Code
        language="js"
        code={codeBlock}
        plugins={[]}
        lineHighlight={[1, 5]}
      />
      <Code language="html" code={htmlBlock} plugins={[]} />
    </div>
  );
}

export default App;
