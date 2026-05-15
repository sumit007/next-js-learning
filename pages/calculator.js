import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

function compute(left, right, operator) {
  const a = parseFloat(left)
  const b = parseFloat(right)
  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      if (b === 0) return null
      return a / b
    default:
      return b
  }
}

function formatResult(value) {
  const str = String(value)
  if (str.length > 12) {
    return parseFloat(value.toPrecision(10)).toString()
  }
  return str
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [error, setError] = useState(false)

  function clearAll() {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setError(false)
  }

  function inputDigit(digit) {
    if (error) return
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }
    setDisplay(display === '0' ? digit : display + digit)
  }

  function inputDecimal() {
    if (error) return
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  function handleOperator(nextOperator) {
    if (error) return

    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator && !waitingForOperand) {
      const result = compute(previousValue, inputValue, operator)
      if (result === null) {
        setDisplay('Error')
        setError(true)
        setPreviousValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }
      const formatted = formatResult(result)
      setDisplay(formatted)
      setPreviousValue(parseFloat(formatted))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  function handleEquals() {
    if (error || operator === null || waitingForOperand) return

    const inputValue = parseFloat(display)
    const result = compute(previousValue, inputValue, operator)

    if (result === null) {
      setDisplay('Error')
      setError(true)
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      return
    }

    const formatted = formatResult(result)
    setDisplay(formatted)
    setPreviousValue(parseFloat(formatted))
    setOperator(null)
    setWaitingForOperand(true)
  }

  const buttons = [
    { label: 'C', action: clearAll, className: 'fn' },
    { label: '÷', action: () => handleOperator('÷'), className: 'op' },
    { label: '×', action: () => handleOperator('×'), className: 'op' },
    { label: '−', action: () => handleOperator('-'), className: 'op' },
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '+', action: () => handleOperator('+'), className: 'op tall' },
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '=', action: handleEquals, className: 'eq tall' },
    { label: '0', action: () => inputDigit('0'), className: 'wide' },
    { label: '.', action: inputDecimal },
  ]

  return (
    <div className="container">
      <Head>
        <title>Calculator | Next.js Demo</title>
      </Head>

      <main>
        <h1 className="title">Calculator</h1>

        <div className="calc">
          <div className="display">{display}</div>
          <div className="keys">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                className={['key', btn.className].filter(Boolean).join(' ')}
                onClick={btn.action}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <p className="back">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        main {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          margin: 0 0 1.5rem;
          font-size: 2rem;
          color: #111;
        }

        .calc {
          width: 100%;
          background: #fff;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .display {
          padding: 1.25rem 1rem;
          text-align: right;
          font-size: 2.5rem;
          font-family: Menlo, Monaco, 'Courier New', monospace;
          background: #fafafa;
          border-bottom: 1px solid #eaeaea;
          min-height: 3.5rem;
          word-break: break-all;
        }

        .keys {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #eaeaea;
        }

        .key {
          border: none;
          background: #fff;
          font-size: 1.35rem;
          padding: 1.1rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .key:hover {
          background: #f5f5f5;
        }

        .key:active {
          background: #eee;
        }

        .key.fn {
          color: #c00;
        }

        .key.op {
          color: #0070f3;
          font-weight: 600;
        }

        .key.eq {
          background: #0070f3;
          color: #fff;
        }

        .key.eq:hover {
          background: #0060df;
        }

        .key.wide {
          grid-column: span 2;
        }

        .key.tall {
          grid-row: span 2;
        }

        .back {
          margin-top: 2rem;
        }

        .back-link {
          color: #0070f3;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          background: #fafafa;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
