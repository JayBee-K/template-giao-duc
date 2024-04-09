var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {

		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}


const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'Đã sao chéo');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
				}
			});
		})
	}
}

const handleInitFancybox = function () {
	if ($('.initFancybox').length) {
		$('.initFancybox').each(function () {
			let elm = $(this);
			Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
				thumbs: {
					autoStart: true,
				},
			});
		});
	}
}
const handleContentDetail = () => {
	if ($('#detailContent').length > 0) {
		if ($('#detailContent img').length > 0) {
			$('#detailContent img').each((index, elm) => {
				$(elm).wrap(`<a style="cursor: zoom-in" href="${$(elm).attr('src')}" data-caption="${$(elm).attr('alt')}" data-fancybox="images-detail"></a>`);
			});

			Fancybox.bind('[data-fancybox]', {
				thumbs: {
					autoStart: true,
				},
			});
		}

		if ($('#detailContent table').length > 0) {
			$('#detailContent table').map(function () {
				$(this).addClass('table table-bordered');
				$(this).wrap('<div class="table-responsive"></div>');
			})
		}
	}
}

const handleChangeImageIntroduction = function () {
	if ($('.introductionImageThumb').length && $('#introductionItemAvatar').length) {
		$('.introductionImageThumb').click(function () {
			if ($(this).hasClass('active')) {
				return false;
			} else {
				$('.introductionImageThumb').removeClass('active');
				$(this).addClass('active');
				let src = $(this).attr('data-src');
				$("#introductionItemAvatar img").fadeOut(150, function () {
					$("#introductionItemAvatar img").attr('src', src);
				}).fadeIn(150);
			}
		})
	}
}

const handleCollapseDescription = function () {
	if ($('#handleDescription').length > 0) {
		let handleDescription = $('#handleDescription');
		let limitHeight = handleDescription.attr('data-limit');

		if (handleDescription.height() > limitHeight) {
			let originalHeight = handleDescription.height() + 40;
			handleDescription.attr('data-original', originalHeight + 40);
			handleDescription.css({
				'--limit': limitHeight + 'px',
				'--original': originalHeight + 'px'
			});
			handleDescription.addClass('limitDescription');
		} else {
			handleDescription.removeAttr('data-limit');
			handleDescription.find('#handleDescriptionButton').remove();
		}

		handleDescription.find('#handleDescriptionButton a').click(function () {
			let handleDescriptionButton = $(this);
			let textOriginal = ' Xem chi tiết';
			let textChanged = ' Thu gọn';

			if (handleDescription.hasClass('originalDescription')) {
				handleDescription.removeClass('originalDescription');
				handleDescriptionButton.html(`${textOriginal} <i class="fas fa-caret-down"></i>`);
			} else {
				handleDescription.addClass('originalDescription');
				handleDescriptionButton.html(`${textChanged} <i class="fas fa-caret-up"></i>`);
			}
		});
	}
}

const handleCounter = function () {
	if ($('#handleCounter').length && $('#handleCounter .handleCounterItem').length) {
		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('#handleCounter').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('#handleCounter .handleCounterItem').each(function () {
					let counterItem = $(this),
						counterItemValue = counterItem.attr('data-value'),
						counterItemText = counterItem.attr('data-text');
					$({countNum: counterItem.text()}).animate(
						{countNum: counterItemValue},
						{
							duration: 2000,
							easing: 'swing',
							step: function () {
								counterItem.text(Math.floor(this.countNum));
							},
							complete: function () {
								counterItem.html(this.countNum.toString() + (counterItemText !== '' ? '&nbsp;' + counterItemText : ''));
							}
						});
				});
				i = 1;
			}
		});
	}
}
$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	})
	handleStickHeader();
	handleCopyValue();
	handleInitFancybox();

	handleContentDetail();

	handleChangeImageIntroduction();

	handleCollapseDescription();

	handleCounter();

	if ($('#slider-hero').length) {
		new Swiper('#slider-hero .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			navigation: {
				nextEl: "#slider-hero .slider-navigation .slider-navigation_next",
				prevEl: "#slider-hero .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-feedback').length) {
		new Swiper('#slider-feedback .swiper', {
			speed: 500,
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			navigation: {
				nextEl: "#slider-feedback .slider-navigation .slider-navigation_next",
				prevEl: "#slider-feedback .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-gallery').length) {
		new Swiper('#slider-gallery .swiper', {
			speed: 500,
			spaceBetween: 8,
			slidesPerView: 3,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			loop: 0,
			navigation: {
				nextEl: "#slider-gallery .slider-navigation .slider-navigation_next",
				prevEl: "#slider-gallery .slider-navigation .slider-navigation_prev",
			},
			breakpoints: {
				1359: {
					slidesPerView: 3,
				},
				991: {
					slidesPerView: 3.5,
				},
				768: {
					slidesPerView: 2.5,
				},
				375: {
					slidesPerView: 1.5,
				},
				320: {
					slidesPerView: 1,
				}
			},
		});
	}

	if ($('#slider-why').length) {
		new Swiper('#slider-why .swiper', {
			speed: 500,
			spaceBetween: 24,
			slidesPerView: 3,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			loop: 0,
			navigation: {
				nextEl: "#slider-why .slider-navigation .slider-navigation_next",
				prevEl: "#slider-why .slider-navigation .slider-navigation_prev",
			},
			breakpoints: {
				1359: {
					slidesPerView: 3,
				},
				991: {
					slidesPerView: 3.5,
				},
				768: {
					slidesPerView: 2.5,
				},
				375: {
					slidesPerView: 1.5,
				},
				320: {
					slidesPerView: 1,
				}
			},
		});
	}
});