import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

interface DropdownProps {
  title: string;
  selected: string;
  options: string[];
  onSelect: any;
}

export default function Dropdown({ title, selected, options, onSelect }: DropdownProps) {

  const menuItems = options.map((option, index) => {
    return (
      <MenuItem key={index}>
        {({ active }) => (
        <button
          className={clsx(
            'group flex w-full items-center rounded-md px-2 py-2 text-md',
            (active) ? 'bg-darkgray text-mywhite' : 'text-darkgray',
            (selected == option) ? 'border-2 border-darkgray' : '' 
          )}
          onClick={() => onSelect(option)}>
        {option}
        </button>
    )}
      </MenuItem>
    )
  })

  return (
    <Menu as="div" className="text-left max-w-56">
      <div>
        <MenuButton className=" w-[9rem] flex gap-4 justify-left rounded-md bg-darkgray hover:drop-shadow-lg hXXXover:shadow-black/50 duration-300 text-white px-4 py-2 text-lg font-medium">
          {title}
          <ChevronDownIcon
            className="-mr-1 ml-2 my-auto h-5 w-5 text-white "
            aria-hidden="true"
          />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-[70%]"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-[70%]" 
      >
        <MenuItems className="p-1 font-medium z-[9999] w-[9rem] absolute origin-top-right rounded-md bg-lightgray shadow-lg shadow-black/50">
            {menuItems}
        </MenuItems>
      </Transition>
    </Menu>
  )
}
