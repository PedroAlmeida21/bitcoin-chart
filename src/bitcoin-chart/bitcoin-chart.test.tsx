import { render } from '@testing-library/react';
import BitcoinChart from './';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';

configure({adapter: new Adapter()});

it("renders correctly", () => {
    shallow(<BitcoinChart />);
  });

it('Renders BitcoinChart with correct class', () => {
  const { container } = render(<BitcoinChart />)
  expect(container.classList.contains('bitcoin-chart'))
})

it("title renders correctly", async () => {
    const wrapper = shallow(<BitcoinChart />);
    expect(wrapper.find("h2").text()).equal("Bitcoin Chart");
});