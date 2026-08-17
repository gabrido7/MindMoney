type Props = {
  saldo: number
}

function Saldo({ saldo }: Props) {
  return <h2>Saldo atual: R$ {saldo}</h2>
}

export default Saldo