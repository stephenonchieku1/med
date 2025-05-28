import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserPreferences from '../UserPreferences';
import { UserContext } from '../../context/UserContext';

const mockUserContext = {
  language: 'en',
  setLanguage: jest.fn(),
  diet: 'vegetarian',
  setDiet: jest.fn(),
  allergies: ['peanuts'],
  setAllergies: jest.fn(),
  preferences: {
    spicy: true,
    sweet: false,
    salty: true
  },
  setPreferences: jest.fn()
};

describe('UserPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all preference sections', () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserPreferences />
      </UserContext.Provider>
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Taste Preferences')).toBeInTheDocument();
  });

  it('updates language when changed', () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserPreferences />
      </UserContext.Provider>
    );

    const languageSelect = screen.getByLabelText('Language');
    fireEvent.change(languageSelect, { target: { value: 'es' } });

    expect(mockUserContext.setLanguage).toHaveBeenCalledWith('es');
  });

  it('updates diet when changed', () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserPreferences />
      </UserContext.Provider>
    );

    const dietSelect = screen.getByLabelText('Dietary Preferences');
    fireEvent.change(dietSelect, { target: { value: 'vegan' } });

    expect(mockUserContext.setDiet).toHaveBeenCalledWith('vegan');
  });

  it('updates allergies when changed', () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserPreferences />
      </UserContext.Provider>
    );

    const allergiesInput = screen.getByLabelText('Allergies');
    fireEvent.change(allergiesInput, { target: { value: 'peanuts, shellfish' } });

    expect(mockUserContext.setAllergies).toHaveBeenCalledWith(['peanuts', 'shellfish']);
  });

  it('updates taste preferences when changed', () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserPreferences />
      </UserContext.Provider>
    );

    const spicyCheckbox = screen.getByLabelText('Spicy');
    fireEvent.click(spicyCheckbox);

    expect(mockUserContext.setPreferences).toHaveBeenCalledWith({
      ...mockUserContext.preferences,
      spicy: false
    });
  });
}); 