export function getMenu(role: string) {
  const menu = [];
  if(role === 'ADMIN') {
    menu[0] = { name: 'Admin Panel', link: 'admin' };
    menu[1] = { name: 'Liferants', link: 'liferant' };
    menu[2] = { name: 'Kategories', link: 'kategory'};
    menu[3] = { name: 'User Panel', link: 'user' };
    menu[4] = { name: 'Products', link: 'product' };
    menu[5] = { name: 'Waren Eingang', link: 'waren-eingang' };
    menu[6] = { name: 'Company', link: 'company' };
    menu[7] = { name: 'Bestellungen', link: 'admin-order'};
    menu[8] = { name: 'Ebay-Verkauf/Login', link: 'ebay'};
    menu[9] = {name: 'Ebay - Subscriptions', link: 'ebay-subs'};
    menu[10] = { name: 'Ebay - Inventory', link: 'ebay-items' };
    menu[11] = { name: 'Lager', link: 'lager'};
    menu[12] = { name: 'Shipping-cost', link: 'shipping'};
    menu[13] = { name: 'Sitemap', link: 'sitemap'};

  } else if (role === 'USER') {
    menu[0] = { name: 'User Profil', link: 'user' };
    menu[1] = { name: 'Mein Bestellungen', link: 'order' }
  }
  return menu;
}
