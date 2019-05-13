import styled from "styled-components"
import { primary, white } from "../colors"

export default styled.button`
  background-color: ${({active}) => active ? white : primary};
  color:            ${({active}) => active ? primary : white};

  display: inline-block;
  padding: 0.5rem;
  text-align: center;
  text-decoration: none;
  width: auto;

  &:hover {
    background-color: ${primary};
  }

  border-radius: 0.35em;
  border: 2px solid rgba(100, 100, 100, 0.2);

  font-weight: 400;
`
