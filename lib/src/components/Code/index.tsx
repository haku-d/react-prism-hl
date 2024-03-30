import { useEffect, useState } from 'react';
import Prism from 'prismjs';

import './style.css';

type CodeProps = {
  language: string;
  code: string;
  plugins?: string[];
  lineHighlight?: number[];
};

type TokenProps = {
  token: string | Prism.Token[];
  lineNo: number | string;
  highLight: boolean;
};

type PrismToken = string | Prism.Token;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Group tokens by line
 * @param tokens
 * @returns
 */
const reduceTokens = (tokens: PrismToken[]) => {
  let nextLine = false;
  return tokens.reduce<(string | Prism.Token[])[]>((results, token) => {
    // Check for new line
    if (typeof token === 'string' && /\n/.test(token)) {
      nextLine = true;
      const countSpaces = token.toString().split(' ').length - 1;
      if (countSpaces > 0) nextLine = false;
      return [
        ...results,
        ...Array([...token.toString().matchAll(/\n/g)].length - 1).fill('\n'),
        ...(countSpaces > 0 ? [[Array(countSpaces).fill(' ').join('')]] : []),
      ];
    }

    if (nextLine) {
      nextLine = false;
      return [...results, [token]];
    } else {
      const prevLine = results[results.length - 1] || [];
      return [...results.slice(0, -1), [...prevLine, token]];
    }
  }, []);
};

/**
 * Render nested tokens
 * @param token
 * @param key
 * @returns
 */
const renderToken = (
  token: string | Prism.Token,
  key: string | number
): React.ReactNode => {
  if (typeof token === 'string') return token;
  if (typeof token.content === 'string')
    return (
      <span key={key} className={`token ${token.type}`}>
        {token.content}
      </span>
    );
  if (typeof token.content === 'object' && Array.isArray(token.content)) {
    return (
      <span key={key} className={`token ${token.type}`}>
        {token.content.map((t, idx) => renderToken(t, idx))}
      </span>
    );
  }
  return;
};

const Token = ({ token, lineNo, highLight = false }: TokenProps) => {
  return (
    <div
      className={classNames(
        'flex items-baseline space-x-4 leading-relaxed',
        highLight ? 'bg-pink-200' : ''
      )}
    >
      <span className="text-sm text-gray-400 select-none">{lineNo}</span>
      {typeof token !== 'string' && (
        <span>
          {token.map((t, key) => {
            return typeof t === 'string' ? t : renderToken(t, key);
          })}
        </span>
      )}
    </div>
  );
};

export default function Code(props: CodeProps) {
  const { language, code, lineHighlight } = props;
  const [tokens, setTokens] = useState<(string | Prism.Token[])[]>([]);

  useEffect(() => {
    // an array with the tokenized code
    const tokenizedCode = Prism.tokenize(
      code.trim(),
      Prism.languages[language]
    );
    // tokens in same line will be grouped
    const reducedTokens = reduceTokens(tokenizedCode);
    setTokens(reducedTokens);
  }, [code, language]);

  return (
    <pre
      className={classNames(
        `language-${language}`,
        'w-full p-5 m-0 rounded-none border overflow-auto font-mono leading-5 break-all whitespace-pre-wrap select-text'
      )}
    >
      <code className={`language-${language}`}>
        {tokens.map((token, idx: number) => (
          <Token
            key={idx}
            highLight={
              lineHighlight ? lineHighlight.indexOf(idx + 1) !== -1 : false
            }
            lineNo={(idx + 1)
              .toString()
              .padStart(tokens.length.toString().length, ' ')}
            token={token}
          />
        ))}
      </code>
    </pre>
  );
}
