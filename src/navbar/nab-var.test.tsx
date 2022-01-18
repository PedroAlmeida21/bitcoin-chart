import { render } from '@testing-library/react';
import NavBar from './';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';

configure({adapter: new Adapter()});

it('Renders NavBar with correct class', () => {
  const { container } = render(<NavBar />)
  expect(container.classList.contains('navigation-bar'))
})

it('NavBar has image element', () => {
    const wrapper = shallow(<NavBar />);
    expect(wrapper.find('img')).to.have.lengthOf(1);
});