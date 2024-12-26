'use client';

import type React from 'react';
import classNames from 'classnames';

import {
  Flex,
  DropdownWrapper,
  type DropdownProps,
  User,
  type UserProps,
} from '.';
import type { DropdownOptions } from '.';
import styles from './UserMenu.module.scss';

interface UserMenuProps extends UserProps {
  selected?: boolean;
  dropdownOptions?: DropdownOptions[];
  dropdownAlignment?: 'left' | 'center' | 'right';
  dropdownProps?: Omit<DropdownProps, 'options'> & {
    onOptionSelect?: (option: DropdownOptions) => void;
  };
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  selected = false,
  dropdownOptions = [],
  dropdownAlignment = 'left',
  dropdownProps,
  className,
  ...userProps
}) => {
  return (
    <DropdownWrapper
      dropdownOptions={dropdownOptions}
      dropdownProps={dropdownProps}
    >
      <Flex
        direction="column"
        padding="4"
        radius="full"
        border={selected ? 'neutral-medium' : 'transparent'}
        background={selected ? 'neutral-strong' : 'transparent'}
        style={{ cursor: 'pointer' }}
        className={classNames(
          className || '',
          selected ? styles.selected : '',
          styles.wrapper
        )}
      >
        <User {...userProps} />
      </Flex>
    </DropdownWrapper>
  );
};

UserMenu.displayName = 'UserMenu';

export { UserMenu };
