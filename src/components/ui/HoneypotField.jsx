// Hidden honeypot field — bots that fill it are silently ignored.

function HoneypotField({ name = 'website', onChange, value }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Website</label>
      <input
        autoComplete="off"
        id={name}
        name={name}
        onChange={onChange}
        tabIndex={-1}
        type="text"
        value={value}
      />
    </div>
  )
}

export default HoneypotField
