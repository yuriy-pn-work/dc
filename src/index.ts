import * as fs from 'fs';

const prices = JSON.parse(fs.readFileSync('./price.json').toString('utf-8'));

const getRawOrder = () => {
	const content = fs.readFileSync('./order.txt').toString('utf-8').trim();
	const parts = content.split('\n\n');
	const order = parts.map(line => {
		const p = line.split('\n');
		const name = p[0];
		const goods = p.slice(1);

		return { name, goods };
	});
	return { order };
}

const getOrder = () => {
	const rawOrder = getRawOrder();

	return rawOrder.order.map(line => {
		const name = line.name;

		const order = line.goods.map(item => {
			const price = prices.price.find(p => p[0].trim().toLocaleLowerCase() === item.trim().toLocaleLowerCase());
			const result = price !== undefined ? { success: true, price: price[1] } : { success: false };
			return ({ name: item, price: result });
		});

		return { name, order };
	});
};

const run = async () => {
	const order = await getOrder();
	console.log(order.map(user => `${user.name}:\n${user.order.map(o => `${o.name}: ${o.price.success ? `${o.price.price} руб.` : `ОШИБКА!!!`}`).join('\n')}`).join('\n\n'));
};

run();
