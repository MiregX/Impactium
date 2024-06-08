import input from './styles/InputMin.module.css'

interface InputMin {
  value: string
  before?: string 
}

export function InputMin({ value, before }: InputMin) {
  return (
    <div className={input.wrapper}>
      {before && <p>{before}</p>}
      <input className={input._} value={value} />
    </div>
  )
}